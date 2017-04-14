package <%= package %>.jpa;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Timer {

	@Id
	@GeneratedValue(strategy= GenerationType.AUTO)
	private Long id;

	private String name;

	private Date time;

	private Long count;

	private Double mean;

	private Double min;

	private Double max;

	private Double median;

	private Double p75;

	private Double p95;

	private Double p99;

	private Double p999;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	public Long getCount() {
		return count;
	}

	public void setCount(Long count) {
		this.count = count;
	}

	public Double getMean() {
		return mean;
	}

	public void setMean(Double mean) {
		this.mean = mean;
	}

	public Double getMin() {
		return min;
	}

	public void setMin(Double min) {
		this.min = min;
	}

	public Double getMax() {
		return max;
	}

	public void setMax(Double max) {
		this.max = max;
	}

	public Double getMedian() {
		return median;
	}

	public void setMedian(Double median) {
		this.median = median;
	}

	public Double getP75() {
		return p75;
	}

	public void setP75(Double p75) {
		this.p75 = p75;
	}

	public Double getP95() {
		return p95;
	}

	public void setP95(Double p95) {
		this.p95 = p95;
	}

	public Double getP99() {
		return p99;
	}

	public void setP99(Double p99) {
		this.p99 = p99;
	}

	public Double getP999() {
		return p999;
	}

	public void setP999(Double p999) {
		this.p999 = p999;
	}
}
